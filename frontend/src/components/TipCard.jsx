import React from "react";

const TipCard = ({ tip }) => {
  return (
    <div className="w-[200px] h-[200px] bg-white rounded-md flex flex-col p-3">
      <div>
        <div className="font-bold">Message:</div>
        <div>{tip.message}</div>
      </div>

      <div>Tip: {tip.tip} ETH</div>
      <div>Address</div>
    </div>
  );
};

export default TipCard;
