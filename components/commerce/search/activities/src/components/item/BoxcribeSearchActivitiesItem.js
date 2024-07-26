import BoxcribeSearchActivitiesLoader from "../loader/BoxcribeSearchActivitiesLoader";
import LinesEllipsis from "react-lines-ellipsis";
import { cisThumbUpSvg } from "../../assets/js/cisThumbUpSvg";

function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

export default function BoxcribeSearchActivityItem({ loading = false, item }) {
  function getItemRatingContent() {
    if (!item.tour_rating) {
      return;
    }

    let badgeClass;

    if (item.tour_rating >= 7) {
      badgeClass = "success";
    } else if (item.tour_rating >= 5) {
      badgeClass = "warning";
    } else {
      badgeClass = "danger";
    }

    const reviewsNumber = item.tour_reviews.reduce(
      (acc, { totalCount }) => (acc += totalCount),
      0,
    );

    return (
      <div className="boxcribe-search-activities__item-rating">
        <div
          className={`boxcribe-search-activities__item-rating-badge ${badgeClass}`}
        >
          {cisThumbUpSvg}
          {roundHalf(item.tour_rating)}
        </div>
        <div>{reviewsNumber} Reviews</div>
      </div>
    );
  }

  return (
    <div className="boxcribe-search-activities__item">
      {loading && <BoxcribeSearchActivitiesLoader />}
      {!loading && (
        <>
          <img
            src={item.tour_images[0]}
            alt=""
            className="boxcribe-search-activities__item-image"
          />
          <div className="boxcribe-search-activities__item-title">
            {item.tour_name}
          </div>
          <div className="boxcribe-search-activities__item-description">
            <LinesEllipsis
              text={item.tour_description}
              maxLine={6}
              basedOn="words"
            />
          </div>
          <div className="boxcribe-search-activities__item-footer">
            {getItemRatingContent()}
            <div className="boxcribe-search-activities__item-price">
              ${item.offer_price.toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
