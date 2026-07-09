import { useEffect, useRef, useState } from "react";
import type { Driver } from "../types/Driver";

type DriverSelectProps = {
  drivers: Driver[];
  value: string;
  onChange: (driver: string) => void;
};

function DriverSelect({
  drivers,
  value,
  onChange,
}: DriverSelectProps) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedDriver = drivers.find((d) => d.name === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="driver-select" ref={wrapperRef}>
      <button
        className="driver-select-button"
        onClick={() => setOpen(!open)}
      >
        {selectedDriver && (
          <>
            <div className="driver-select-left">
              <div
                className="driver-color"
                style={{ background: selectedDriver.color }}
              />

              <div>
                <div className="driver-select-name">
                  {selectedDriver.name}
                </div>

                <div className="driver-select-team">
                  #{selectedDriver.number} • {selectedDriver.team}
                </div>
              </div>
            </div>

            <span className="driver-arrow">
              {open ? "▲" : "▼"}
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="driver-dropdown">
          {drivers.map((driver) => (
            <button
              key={driver.number}
              className="driver-option"
              onClick={() => {
                onChange(driver.name);
                setOpen(false);
              }}
            >
              <div
                className="driver-color"
                style={{ background: driver.color }}
              />

              <div className="driver-option-info">
                <div className="driver-option-name">
                  {driver.name}
                </div>

                <div className="driver-option-team">
                  #{driver.number} • {driver.team}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverSelect;