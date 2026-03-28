import React, { useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

const CountUpComponent = CountUp.default || CountUp;

export const StatCounter = ({ end, prefix = '', suffix = '', duration = 2.5, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUpComponent
          start={0}
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          separator=","
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </span>
  );
};
