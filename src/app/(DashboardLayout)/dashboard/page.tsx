"use client";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Progress, Table } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import SimpleBar from "simplebar-react";
import axios from "axios";

interface Record {
  title: string;
  category: string;
  date: string;
  time: string;
  image: string; // Image URL
}

const PopularProducts = () => {
  const [records, setRecords] = useState<Record[]>([]);

  // Fetch health records for a specific email
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const email = "nsriramya7@gmail.com"; // Replace with the actual email to fetch data for
        const response = await axios.get(`http://127.0.0.1:80/getrecords?email=${email}`);
        setRecords(response.data.records);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  // Table Action Data
  const tableActionData = [
    { icon: "solar:add-circle-outline", listtitle: "Add" },
    { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
    { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
  ];

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray py-6 px-0 relative w-full break-words">
        <div className="px-6">
          <h5 className="card-title">Health Records</h5>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Image</Table.HeadCell>
                <Table.HeadCell className="p-6">Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {records.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <img
                        src={item.image} // Use the image URL from the record
                        alt={item.title} // Alt text for the image
                        className="w-16 h-16 object-cover rounded" // Adjust width, height, and other styles as needed
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center">
                        <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                          <h6 className="text-sm">{item.title}</h6>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item.category}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item.date}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item.time}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                            <HiOutlineDotsVertical size={22} />
                          </span>
                        )}
                      >
                        {tableActionData.map((items, index) => (
                          <Dropdown.Item key={index} className="flex gap-3">
                            <Icon icon={`${items.icon}`} height={18} />
                            <span>{items.listtitle}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>
      </div>
    </>
  );
};

export default PopularProducts;
