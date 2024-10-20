import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

function ContextMenu({ data }) {
  const router = useRouter();
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      // Close the context menu (you may implement state for visibility)
      // Example: setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`z-10 bg-white divide-y divide-gray-100 shadow-2xl border w-44 dark:bg-gray-700 fixed right-5 top-20`}
      role="menu"
      aria-label="Context Menu"
    >
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {data.map(({ name, callback }, index) => (
          <li
            key={index}
            onClick={(e) => {
              callback(e);  // Pass the event to the callback
              // Close the menu after selection if necessary
              // Example: setVisible(false);
            }}
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                callback(e);  // Pass the event to the callback
                // Close the menu after selection if necessary
                // Example: setVisible(false);
              }
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// PropTypes validation
ContextMenu.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default ContextMenu;
