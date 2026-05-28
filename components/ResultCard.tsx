"use client";
import type { Recommendation, Place } from "@/lib/types";
import styles from "./ResultCard.module.css";

interface Props {
  recommendation: Recommendation;
  places: Place[];
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className={styles.stars}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
      <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
    </span>
  );
}

function PriceLevel({ level }: { level: number }) {
  return <span className={styles.price}>{"RM".repeat(level)}</span>;
}

export default function ResultCard({ recommendation: r, places }: Props) {
  return (
    <div className={styles.card}>
      {/* Vibe check */}
      <div className={styles.vibe}>
        <span className={styles.vibeIcon}>✨</span>
        <p>{r.vibe}</p>
      </div>

      {/* Main recommendation */}
      <div className={styles.mainRec}>
        <div className={styles.mainHeader}>
          <div>
            <div className={styles.recLabel}>Top Pick</div>
            <h2 className={styles.dishName}>{r.main_dish}</h2>
          </div>
          <div className={styles.badges}>
            <span className={styles.badge}>{r.stall_type}</span>
            <span className={`${styles.badge} ${styles.badgePrice}`}>{r.price_range}</span>
          </div>
        </div>
        <p className={styles.reason}>{r.main_reason}</p>
        <div className={styles.whereRow}>
          <span className={styles.whereIcon}>📍</span>
          <span className={styles.whereText}>{r.where_to_eat}</span>
        </div>
        {r.fun_fact && (
          <div className={styles.funFact}>
            <span>💡</span>
            <span>{r.fun_fact}</span>
          </div>
        )}
      </div>

      {/* Alternatives */}
      <div className={styles.alts}>
        <div className={styles.altsLabel}>Still thinking? Try these instead</div>
        <div className={styles.altGrid}>
          <div className={styles.altCard}>
            <div className={styles.altTop}>
              <span className={styles.altDish}>{r.alt1_dish}</span>
              <span className={styles.altTag}>{r.alt1_cuisine}</span>
            </div>
            <p className={styles.altReason}>{r.alt1_reason}</p>
          </div>
          <div className={styles.altCard}>
            <div className={styles.altTop}>
              <span className={styles.altDish}>{r.alt2_dish}</span>
              <span className={`${styles.altTag} ${styles.altTagBudget}`}>{r.alt2_type}</span>
            </div>
            <p className={styles.altReason}>{r.alt2_reason}</p>
          </div>
        </div>
      </div>

      {/* Nearby places */}
      {places.length > 0 && (
        <div className={styles.places}>
          <div className={styles.placesLabel}>Nearby Spots</div>
          <div className={styles.placesGrid}>
            {places.map((place, i) => (
              <a
                key={i}
                href={place.maps_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.placeCard}
              >
                <div className={styles.placeName}>{place.name}</div>
                <div className={styles.placeAddress}>{place.address}</div>
                <div className={styles.placeMeta}>
                  {place.rating && <StarRating rating={place.rating} />}
                  {place.price_level && <PriceLevel level={place.price_level} />}
                  {place.open_now !== undefined && (
                    <span className={place.open_now ? styles.open : styles.closed}>
                      {place.open_now ? "Open" : "Closed"}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
