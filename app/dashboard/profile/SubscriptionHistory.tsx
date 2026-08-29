"use client";
import { useEffect, useRef, useState } from "react"; 
import Loading from "@/app/components/Loading";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SubscriptionHistory() {
  const { data, mutate, isLoading } = useSWR(
    `/api/subscription/history`,
    fetcher
  );


    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    }

  if (isLoading) return <></>;
    function statusBadge(status: string) {
        switch (status) {
            case 'pending':
                return <span className="badge bg-warning">Pending</span>;
            case 'paid':
                return <span className="badge bg-primary">Paid</span>;
            case 'cancelled':
                return <span className="badge bg-danger">Cancelled</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
    }


    return (
        <>
        <table className="table align-middle table-hover m-0">
            <thead>
                <tr>
                <th scope="col">Order No.</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                
                {data.data.map((subscription: any, index: number) => (
                    <tr key={index}>
                        <td>{subscription.order_no}</td>
                        <td>{formatDate(subscription.date)}</td>
                        <td>${subscription.amount.toFixed(2)}</td>
                        <td>{statusBadge(subscription.status)}</td>
                    </tr>
                ))}
                {data.data.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center">No subscription history found.</td>
                    </tr>
                )}
            </tbody>
        </table>
        </>
    );
}