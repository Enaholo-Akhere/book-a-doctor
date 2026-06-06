import useCountUp from '@/Hook/auth/useCountUp';

const StatItem = ({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label?: string;
}) => {
  const { count, ref } = useCountUp(target);

  return (
    <div ref={ref}>
      <span>
        {count}
        {suffix}
      </span>
      {label && <p>{label}</p>}
    </div>
  );
};

export default StatItem;
