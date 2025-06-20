const FadingCircles = ({ radius = 10 }: { radius?: number }) => {
  // Gap is proportional to radius for consistent appearance
  const gap = radius * 2;
  // Add padding to prevent cropping
  const padding = Math.max(2, radius * 0.6);
  // Calculate total width needed for 3 circles and 2 gaps, plus padding on both sides
  const svgWidth = radius * 2 * 3 + gap * 2 + padding * 2;
  const svgHeight = radius * 2 + padding * 2;
  // Calculate cx positions for each circle (start after padding + radius)
  const cx1 = padding + radius;
  const cx2 = cx1 + radius * 2 + gap;
  const cx3 = cx2 + radius * 2 + gap;

  return (
    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ verticalAlign: 'middle' }}
      >
        <circle
          fill='#FFFFFF'
          stroke='#FFFFFF'
          strokeWidth={radius}
          r={radius}
          cx={cx1}
          cy={svgHeight / 2}
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='-.4'
          />
        </circle>
        <circle
          fill='#FFFFFF'
          stroke='#FFFFFF'
          strokeWidth={radius}
          r={radius}
          cx={cx2}
          cy={svgHeight / 2}
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='-.2'
          />
        </circle>
        <circle
          fill='#FFFFFF'
          stroke='#FFFFFF'
          strokeWidth={radius}
          r={radius}
          cx={cx3}
          cy={svgHeight / 2}
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin='0'
          />
        </circle>
      </svg>
    </span>
  );
};

export default FadingCircles;