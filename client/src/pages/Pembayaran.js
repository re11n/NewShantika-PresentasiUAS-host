import { message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";


function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-payment-status",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
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
      const response = await axiosInstance.post("/api/bookings/get-update-payment-status",
      {transactionId: transaksi}
);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "kode transaksi",
      dataIndex: "transactionId",
    },
    {
      title: "tes",
      dataIndex: "_id"
    },
    {
      title: "Nama Bus",
      dataIndex: "name",
      key: "bus",
    },

    {
      title: "Tanggal Berangkat",
      dataIndex: "journeyDate",
    },
    {
      title: "Jam Berangkat",
      dataIndex: "departure",
    },
    {
      title: "Harga",
      dataIndex: "harga",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (Action, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              updatePembayaran(record.transactionId);
            }}
          >
            Bayar Tiket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <PageTitle title="Pembayaran" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>
    </div>
  );
}

export default Bookings;
