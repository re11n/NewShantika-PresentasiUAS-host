import React from "react";
import { useNavigate } from "react-router-dom";

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2">
      <h1 className="text-lg primary-text">{bus.name}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">Dari</p>
          <p className="text-sm">{bus.from}</p>
        </div>

        <div>
          <p className="text-sm">Ke</p>
          <p className="text-sm">{bus.to}</p>
        </div>

        <div>
          <p className="text-sm">Harga Tiket</p>
          <p className="text-sm">Rp {parseInt(bus.fare).toLocaleString('en-US')} /-</p>
        </div>
      </div>
      <div className="d-flex justify-content-between pad">
        <div>
          <p className="text-sm">Jam Berangkat</p>
          <p className="text-sm">{bus.departure}</p>
        </div>

        <div>
          <p className="text-sm">Jam Sampai</p>
          <p className="text-sm">{bus.arrival}</p>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Tanggal Berangkat</p>
          <p className="text-sm">{bus.journeyDate}</p>
        </div>

        <h1 className="text-lg underline secondary-text" onClick={()=>{
            navigate(`/book-now/${bus._id}`)
        }}>Pesan Tiket</h1>
      </div>
    </div>
  );
}

export default Bus;
