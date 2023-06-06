import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";

function PaymentPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [booking, setBooking] = useState(null);
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

  const getBooking = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-transaction-id",
        {
          transactionId: params.transactionId,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const updatePembayaran = async (transaksi) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-update-payment-status",
        { transactionId: transaksi }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate(`/pembayaran/`);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBooking();
  }, []);
  return (
    <div>
      {booking && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">
              Kode Transaksi: {booking.transactionId}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">
                Kursi yang dipesan : {booking.seats.join(", ")}
              </p>
              <p className="text-md">
                Total Harga : Rp{" "}
                {parseInt(booking.harga).toLocaleString("en-US")}
              </p>
              <br></br>
              <p className="text-md">
                Silahkan Bayar melalui salah satu metode pembayaran:
              </p>
              <br></br> 
              <strong className="text-md">
                QRIS:                   
              </strong>
              <br></br>     
              <img src="/img/qr-pembayaran.png"  alt="qr" width="200" height="200"/> 
              <br></br> 
              <br></br> 
              <strong className="text-md">
                Transfer Bank:
              </strong>
              <p className="text-md">
                No rekening: 8162737321713
              </p>
              <p className="text-md">
                A/N New Shantika
              </p>
              

            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => updatePembayaran(booking.transactionId)}
                className={`primary-btn`}
              >
                Sudah Bayar
              </button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default PaymentPage;
