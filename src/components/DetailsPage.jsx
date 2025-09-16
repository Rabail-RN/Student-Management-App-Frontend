import React from "react";

const DetailsPage = ({ std }) => {
  return (
    <div>
      <h3>Student Details</h3>
      <p><b>ID:</b> {std.id}</p>
      <p><b>Name:</b> {std.name}</p>
      <p><b>Reg No:</b> {std.regNo}</p>
    </div>
  );
};

export default DetailsPage;