"use client";
import { createPortal } from "react-dom";
import style from "./modal.module.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  // createPortal쓰는 이유는 모달을 DOM 트리의 다른 위치에 렌더링하기 위해서입니다.
  // 하위에 있으면 웃기다
  const dialogRef = useRef<HTMLDialogElement>(null);

  const route = useRouter();
  useEffect(() => {
    if (!dialogRef?.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({
        top: 0,
      });
    }
  });
  return createPortal(
    <dialog
      onClose={() => {
        route.back();
      }}
      onClick={(e) => {
        if ((e.target as any).nodeName === "DIALOG") {
          route.back();
        }
      }}
      className={style.modal}
      ref={dialogRef}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root") as HTMLDialogElement
  );
}
