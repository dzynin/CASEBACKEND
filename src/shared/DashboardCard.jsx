import React from "react";

function DashboardCard({ title, icon, footerText, number, color }) {
  return (
    <div className="grid-margin">
      <div className="card dashboard-card">
        <div className="card-body">
          <div className="row my-2">
            <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
              <i
                className={`icon-lg mdi ${
                  icon ? icon : "mdi-monitor"
                } ${color ? 'text-'+color : 'color:"#b2b8d2"'} ml-auto`}
              ></i>
            </div>
            <div className="col-8 col-sm-12 col-xl-8 my-auto">
              <div className="row">
                <h5 className="w-100 text-center">{title}</h5>
              </div>
              <div className="row">
                <h2 className="mb-0 w-100 text-center">{number}</h2>
              </div>
            </div>
          </div>
          <div className="row text-center px-2">
            <h6 className="text-white w-100 font-weight-normal">{footerText}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
