import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        harga: bus.fare * selectedSeats.length
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/pembayaran");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

/*  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  */
  useEffect(() => {
    getBus();
  }, []);
  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">
                Tanggal Keberangkatan : {bus.journeyDate}
              </p>
              <p className="text-md">
                Harga : Rp {parseInt(bus.fare).toLocaleString('en-US')} /-
              </p>
              <p className="text-md">
                Jam Berangkat : {bus.departure}
              </p>
              <p className="text-md">
                Jam Sampai : {bus.arrival}
              </p>
              <p className="text-md">
                Kapasitas : {bus.capacity}
              </p>
              <p className="text-md">
                Sisa Kursi : {bus.capacity - bus.seatsBooked.length}
              </p>
            </div>
            <hr />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Kursi yang dipilih : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Harga: Rp {parseInt(bus.fare * selectedSeats.length).toLocaleString('en-US')} /-
              </h1>
              <hr />


                <button
                  onClick={bookNow}
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Pesan Tiket
                </button>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
