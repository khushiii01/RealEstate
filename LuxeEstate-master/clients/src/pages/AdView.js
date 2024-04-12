import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PhotoAlbum from "react-photo-album";
import { Container } from "react-bootstrap";
import "./galleryView.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import AdFeatures from '../components/cards/AdFeatures';
import formatNumber from '../components/helpers/ad';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeUnlike from "../components/misc/LikeUnlike";
import AdCard from '../components/cards/AdCard';
import ContactSeller from "../components/form/ContactSeller";

dayjs.extend(relativeTime) //3 hrs ago
const AdView = () => {
    const [ad, setAd] = useState({});
    const [related, setRelated] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const generatePhotosArray = () => {
        if (ad.photos && ad.photos.length > 0) {
            let arr = ad.photos.map((p) => ({
                src: p.Location,
                width: 250,
                height: 200,
            }));
            setPhotos(arr);
        }
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const { data } = await axios.get(`/ad/${params.slug}`);
                setAd(data?.ad);
                setRelated(data?.related);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        if (params?.slug) {
            fetchAd();
        }
    }, [params?.slug]);

    useEffect(() => {
        generatePhotosArray();
    }, [ad.photos]);

    const CarouselImages = () => {
        return photos.map((photo, index) => (
            <div key={index}>
                <img src={photo.src} alt={`photo-${index}`} />
            </div>
        ));
    };

    const click = () => {
        setOpen(true);
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {open ? (
                        <Carousel className="Carousel-style" width={"55%"} onClose={() => setOpen(false)}>
                            {CarouselImages()}
                        </Carousel>
                    ) : (
                        <>
                            <div className="container-fluid">
                                <div className="row mt-2">
                                    <div className="col-lg-4">
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-primary disabled mt-2">
                                            {ad.type} for {ad.action}
                                        </button>
                                        <LikeUnlike ad={ad}/>
                                        </div>
                                    <div className="col-lg-8">
                                        <div className="d-flex align-items-center">
                                            <span className="mr-2">
                                                {ad?.sold ? "Off market" : "In market"}
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <span className="mr-2">
                                                <h1>{ad.address}</h1>
                                                <AdFeatures ad={ad} />
                                                <h3 className="mt-3 h2">${formatNumber(ad.price)}</h3>
                                                <p className="text-muted">{dayjs(ad?.createdAt).fromNow()}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="row mt-2">
                                    <div className="col-lg-8">
                                        <Container>
                                            <PhotoAlbum onClick={click} layout="columns" photos={photos} columns={3} spacing={5} />
                                        </Container>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="container">
                                <ContactSeller ad={ad}/>
                            </div>
                            {/* <pre>{JSON.stringify({ ad, related }, null, 4)}</pre> */}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default AdView;
