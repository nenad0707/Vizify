"use client";

import { QRCodeCanvas } from "qrcode.react";

interface QRCodeComponentProps {
  url: string;
  size?: number;
}

export default function QRCodeComponent({
  url,
  size = 128,
}: QRCodeComponentProps) {
  return <QRCodeCanvas value={url} size={size} />;
}
