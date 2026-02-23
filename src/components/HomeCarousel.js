import { useEffect } from "react";
import { Carousel } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export default function HomeCarousel() {

  useEffect(() => {
    const el = document.getElementById("homeCarousel");
    if (el) {
      new Carousel(el, {
        interval: 3000,
        ride: "carousel",
      });
    }
  }, []);

  return (
    <div className="container mt-3">
      <div id="homeCarousel" className="carousel slide">
        <div className="carousel-inner">

          <div className="carousel-item active text-center">
            <img
              src="/images/products/1.jpg"
              className="d-block mx-auto"
              style={{ maxHeight: "350px" }}
              alt="1"
            />
          </div>

          <div className="carousel-item text-center">
            <img
              src="/images/products/2.jpg"
              className="d-block mx-auto"
              style={{ maxHeight: "350px" }}
              alt="2"
            />
          </div>

          <div className="carousel-item text-center">
            <img
              src="/images/products/3.jpg"
              className="d-block mx-auto"
              style={{ maxHeight: "350px" }}
              alt="3"
            />
          </div>

        </div>

        <button className="carousel-control-prev" type="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}
