"use client";

import { useMemo } from "react";
import ReviewCard, { type Review } from "../shared/cards/review-card";
import Marquee from "../shared/marquee";
import Section, { type ViewMore } from "../shared/section";

export type ReviewsSectionProps = {
  reviews: Review[];
  title?: string;
  description?: string;
  viewMore?: ViewMore;
  itemClassName?: string;
  speed?: number;
  reverseSpeed?: number;
  gap?: number;
  className?: string;
};

function splitRows(reviews: Review[]): [Review[], Review[]] {
  const top: Review[] = [];
  const bottom: Review[] = [];
  reviews.forEach((review, i) => (i % 2 === 0 ? top : bottom).push(review));
  return [top, bottom];
}

export default function ReviewsSection({
  reviews,
  title = "Customer reviews",
  description = "See what other gamers are saying about their top-ups.",
  viewMore,
  itemClassName = "w-[85vw] sm:w-[340px]",
  speed = 40,
  reverseSpeed = 30,
  gap = 16,
  className,
}: ReviewsSectionProps) {
  const [topRow, bottomRow] = useMemo(() => splitRows(reviews), [reviews]);

  if (reviews.length === 0) return null;

  return (
    <Section
      title={title}
      description={description}
      viewMore={viewMore}
      headerWidth="contained"
      contentWidth="bleed"
      className={className}
    >
      <div className="flex flex-col gap-4">
        <Marquee
          label="Customer reviews, row 1"
          items={topRow}
          getKey={(review) => review.id}
          renderItem={(review) => <ReviewCard review={review} />}
          direction="left"
          speed={speed}
          gap={gap}
          itemClassName={itemClassName}
          className="py-1"
        />

        {bottomRow.length > 0 ? (
          <Marquee
            label="Customer reviews, row 2"
            items={bottomRow}
            getKey={(review) => review.id}
            renderItem={(review) => <ReviewCard review={review} />}
            direction="right"
            speed={reverseSpeed}
            gap={gap}
            itemClassName={itemClassName}
            className="py-1"
          />
        ) : null}
      </div>
    </Section>
  );
}
