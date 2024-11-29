"use client";
import React from "react";
import { InfoPopup } from "../components/InfoPopup";
import { MultiStepFormPopup } from "../components/MultipleStepFormPopup";

export default function PopupPage() {
  return (
    <>
      <InfoPopup />
      <MultiStepFormPopup />
    </>
  );
}
