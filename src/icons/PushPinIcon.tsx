import pushPin from '../assets/push-pin.png';

const PushPinIcon = ({ height = 30, width = 30 }: { height?: number; width?: number }) => {
  return (
    <img src={pushPin} alt='Push Pin Icon' height={height} width={width} />
  );
};

export default PushPinIcon;