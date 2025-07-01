import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
const styles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "#0AABE2" : provided.borderColor,
        boxShadow: state.isFocused ? "0 0 0 0.1px #0AABE2" : provided.boxShadow,
        "&:hover": {
            borderColor: state.isFocused ? "#0AABE2" : provided.borderColor,
        },
        backgroundColor: "transparent",
        transition: "border-color 0.2s, box-shadow 0.2s",
        color: "black",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        dark: {
            backgroundColor: "#1f2937",
            color: "white",
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
        color: "black",
        fontSize: "0.875rem",
        dark: {
            backgroundColor: "#1f2937",
            color: "white",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "black",
        borderRadius: "20px",
        dark: {
            color: "white",
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#0AABE2",
        borderRadius: "20px",
        padding: "1px 2px",
        color: "white",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "white",
        ":hover": {
            color: "gray",
        },
    }),
};
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "#2966F4" : provided.borderColor,
        boxShadow: state.isFocused ? "0 0 0 0.1px #2966F4" : provided.boxShadow,
        "&:hover": {
            borderColor: state.isFocused ? "#2966F4" : provided.borderColor,
        },
        backgroundColor: "transparent",
        transition: "border-color 0.2s, box-shadow 0.2s",
        color: "black",
        minHeight: "46px",
        dark: {
            backgroundColor: "#1f2937",
            color: "white",
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
        color: "black",
        dark: {
            backgroundColor: "#1f2937",
            color: "white",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "black",
        dark: {
            color: "white",
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#2966F4",
        borderRadius: "20px",
        padding: "1px 2px",
        color: "white",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "white",
        ":hover": {
            color: "gray",
        },
    }),
};
export { animatedComponents, styles, customStyles };
