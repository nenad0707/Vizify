"use client";

import { QRCodeCanvas } from "qrcode.react";

interface QRCodeComponentProps {
  url: string;
  size?: number;
}

export default function QRCodeComponent({
  url,
  size = 256,
}: QRCodeComponentProps) {
  return (
    <QRCodeCanvas value={url} size={size} level="H" includeMargin={true} />
  );
}
