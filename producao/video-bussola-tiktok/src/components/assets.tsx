import React from "react";
import { Img, staticFile } from "remotion";
import assets from "../data/assets.json";
import { C, FONT, MONO } from "../theme";

/** selo circular; sem public/selo.png usa um substituto (círculo vermelho "OA") */
export const Selo: React.FC<{ size: number }> = ({ size }) =>
  assets.selo ? (
    <Img src={staticFile("selo.png")} style={{ width: size, height: size, display: "block" }} />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.red,
        border: `${size * 0.04}px solid ${C.redDark}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size * 0.38,
        color: C.white,
        letterSpacing: -size * 0.02,
      }}
    >
      OA
    </div>
  );

/** capa do guia (A4 em pé); sem public/capa-guia.png usa um retângulo escuro com o título */
export const CapaGuia: React.FC<{ width: number }> = ({ width }) => {
  const h = width * 1.414;
  return assets.capa ? (
    <Img src={staticFile("capa-guia.png")} style={{ width, height: h, display: "block", objectFit: "cover" }} />
  ) : (
    <div
      style={{
        width,
        height: h,
        background: "#0b0b0d",
        borderTop: `10px solid ${C.red}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: width * 0.08,
        fontFamily: FONT,
        fontWeight: 900,
        color: C.white,
        fontSize: width * 0.085,
        lineHeight: 1,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: width * 0.045, color: C.gray, marginBottom: 12 }}>O GUIA DEFINITIVO DO</div>
      CONCURSEIRO POLICIAL
      <div style={{ color: C.red, fontStyle: "italic" }}>CIBERNÉTICO</div>
    </div>
  );
};
