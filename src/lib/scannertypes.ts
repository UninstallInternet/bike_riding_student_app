import { IBoundingBox, IPoint } from "@yudiel/react-qr-scanner";

export interface IDetectedBarcode {
    boundingBox: IBoundingBox;
    cornerPoints: IPoint[];
    format: string;
    rawValue: string;
}