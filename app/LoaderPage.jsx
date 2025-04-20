import React from "react";

export default function LoaderPage({ className }) {
  return (
    <div className={"flex justify-center items-center " + className}>
      <div>
        <span className="loader"></span>
      </div>
    </div>
  );
}
