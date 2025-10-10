interface ServiceCardProps {
    item: {
        name: string;
        desc: string;
        bgColor: string;
        textColor: string;
    };
    index: number;
}
declare const ServiceCard: ({ item, index }: ServiceCardProps) => import("react/jsx-runtime").JSX.Element;
export default ServiceCard;
