// controllers are pivotal in the MVC architecture, serving as
//the bridge between user interactions,business logic, and data storage
import * as config from '../../config.js';
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import { emailTemplate } from '../helpers/email.js';

export const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    const { image } = req.body;
 
    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];
 
    // image params
    const params = {
      Bucket: "realistapp-udemy-course-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };
 
    config.AWSS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        // console.log(data);
        res.send(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Upload failed. Try again." });
  }
};
 
export const removeImage = (req, res) => {
  try {
    const { Key, Bucket } = req.body;
 
    config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.send({ ok: true });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
 
export const create = async (req, res) => {
  try {
    // console.log(req.body);
    const { photos, description, title, address, price, type, landsize } =
      req.body;
    if (!photos?.length) {
      return res.json({ error: "Photos are required" });
    }
    if (!price) {
      return res.json({ error: "Price is required" });
    }
    if (!type) {
      return res.json({ error: "Is property house or land?" });
    }
    if (!address) {
      return res.json({ error: "Address is required" });
    }
    if (!description) {
      return res.json({ error: "Description is required" });
    }
 
    // const geo = await config.GOOGLE_GEOCODER.geocode(address);
    // console.log("geo => ", geo);
    console.log("------- check 1 -------", req.body)
    const ad = await new Ad({
      ...req.body,
      postedBy: req.user._id,
      // location: {
      //   type: "Point",
      //   coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
      // },
      // googleMap: geo,
      slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`),
    }).save();
    console.log("------- check 2 -------", ad)
    // make user role > Seller
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { role: "Seller" },
      },
      { new: true }
    );
 
    res.json({
      ad,
      user,
    });
  } catch (err) {
    res.json({ error: "Something went wrong. Try again." });
    console.log(err);
  }
};
 
export const ads = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "Sell" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);
 
    const adsForRent = await Ad.find({ action: "Rent" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);
 
    res.json({ adsForSell, adsForRent });
  } catch (err) {
    console.log(err);
  }
};
 
export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );
 
    // related
    // const related = await Ad.find({
    //   _id: { $ne: ad._id },
    //   action: ad.action,
    //   type: ad.type,
    //   address: {
    //     $regex: ad.googleMap[0].city,
    //     $options: "i",
    //   },
    // }).limit(3).select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");
 
    res.json({ ad });
  } catch (err) {
    console.log(err);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { Wishlist: req.body.adId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;

    console.log("added to wishlist => ", rest);

    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const removeFromWishlist=async(req,res)=>{
  try{
  const user=await User.findByIdAndUpdate(
    req.user._id,
    {
    $pull:{Wishlist:req.params.adId},
    //if we write req.body.adId, then it will show the objectid in the wishlist
    //even after we have removed the object from the wishlist
    },
    {new:true}
    );
    const{password,resetCode, ...rest}=user._doc;
    res.json(rest);
  }catch(err){
    console.log(err);
  }
  };
  
  export const contactSeller = async (req, res) => {
    try {
      const { name, email, message, phone, adId } = req.body;


 //Find the ad using its ID and populate the "postedBy" field with the user's email     
      const ad = await Ad.findById(adId).populate("postedBy", "email");
 //Update the user's document to record the property they enquired about 
      const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enquiredProperties: adId },
      });
 //Check if the user was found 
      if (!user) {
        return res.json({ error: "Could not find user with that email" });
      } else {
//Send an email to the property owner
        config.AWSSES.sendEmail(
          emailTemplate(
            ad.postedBy.email,
            `
          <p>You have received a new customer enquiry</p>
  
            <h4>Customer details</h4>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
  
          <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>
          `,
            email,
            "New enquiry received"
          ),
          (err, data) => {
            if (err) {
              console.log(err);
              return res.json({ ok: false });
            } else {
              console.log(data);
              return res.json({ ok: true });
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  export const userAds = async (req, res) => {
    try {
      const perPage = 2;
      const page = req.params.page ? req.params.page : 1;
  
      const total = await Ad.find({ postedBy: req.user._id });
  
      const ads = await Ad.find({ postedBy: req.user._id })
        .populate("postedBy", "name email username phone company")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
  
      res.json({ ads, total: total.length });
    } catch (err) {
      console.log(err);
    }
  };
  export const update = async (req, res) => {
    try {
      const { photos, price, type, address, description } = req.body;
  
      const ad = await Ad.findById(req.params._id);
  
      const owner = req.user._id == ad?.postedBy;
  
      if (!owner) {
        return res.json({ error: "Permission denied" });
      } else {
        // validation
        if (!photos.length) {
          return res.json({ error: "Photos are required" });
        }
        if (!price) {
          return res.json({ error: "Price is required" });
        }
        if (!type) {
          return res.json({ error: "Is property hour or land?" });
        }
        if (!address) {
          return res.json({ error: "Address is required" });
        }
        if (!description) {
          return res.json({ error: "Description are required" });
        }
        await ad.update({
          ...req.body,
          slug: ad.slug,
        });
        res.json({ ok: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  export const remove = async (req, res) => {
    try {
      const ad = await Ad.findById(req.params._id);
      const owner = req.user._id == ad?.postedBy;
  
      if (!owner) {
        return res.json({ error: "Permission denied" });
      } else {
        await Ad.findByIdAndRemove(ad._id);
        res.json({ ok: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  export const enquiredProperties = async (req, res) => {
    try {

// It fetches the user's document using User.findById(req.user._id).
// It then uses the enquiredProperties array from the user document to 
//find corresponding ads using Ad.find({ _id: user.enquiredProperties }).
// The retrieved ads are sorted by the createdAt field in descending order.

      const user = await User.findById(req.user._id);
      const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
        createdAt: -1,
      });
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const wishlist = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const ads = await Ad.find({ _id: user.Wishlist }).sort({
        createdAt: -1,
      });
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };

  export const adsForSell = async (req, res) => {
    try {
      const ads = await Ad.find({ action: "Sell" })
        .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
        .sort({ createdAt: -1 })
        .limit(24);
  
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const adsForRent = async (req, res) => {
    try {
      const ads = await Ad.find({ action: "Rent" })
        .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
        .sort({ createdAt: -1 })
        .limit(24);
  
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };

  export const search = async (req, res) => {
    try {
      console.log("req query", req.query);
      const { action, address, type, priceRange } = req.query;
  
      const ads = await Ad.find({
        action: action === "Buy" ? "Sell" : "Rent",
        type,
        price: {
          $gte: parseInt(priceRange[0]),
          $lte: parseInt(priceRange[1]),
        },
       
      })
        .limit(24)
        .sort({ createdAt: -1 })
        .select(
          "-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap"
        );
      // console.log(ads);
      res.json(ads);
    } catch (err) {
      console.log();
    }
  };