import { Badge } from "antd";
import { Link } from "react-router-dom";
import AdFeatures from "../cards/AdFeatures";
import formatNumber from "../helpers/ad";

export default function UserAdCard({ ad }) {
  console.log("ad", ad); // Add this line to check the value of ad

  if (!ad) {
    return <div>No ad data available</div>;
  }

  console.log("ad.slug", ad.slug); 
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4" key={ad._id}>
      <Link to={`/user/ad/${ad?.slug || ''}`}>
        <Badge.Ribbon
          text={`${ad?.type} for ${ad?.action}`}
          color={`${ad?.action === "Sell" ? "blue" : "red"}`}
        >
          <div className="card hoverable shadow">
            <img
              src={ad?.photos?.[0].Location}
              alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
              style={{ height: "250px", objectFit: "cover" }}
            />

            <div className="card-body">
              <h3>${formatNumber(ad?.price)}</h3>
              <p className="card-text">{ad?.address}</p>

              <AdFeatures ad={ad} />
            </div>
          </div>
        </Badge.Ribbon>
      </Link>
    </div>
  );
}