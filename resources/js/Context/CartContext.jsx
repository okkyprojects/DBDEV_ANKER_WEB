import { createContext, useContext, useState } from "react";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [selectedVariants, setSelectedVariants] = useState([]);

    const toggleVariant = (variant) => {
        setSelectedVariants((prev) => {
            const isSelected = prev.find(
                (v) => v.pivot.uuid === variant.pivot.uuid
            );
            if (isSelected) {
                return prev.filter((v) => v.pivot.uuid !== variant.pivot.uuid);
            } else {
                return [...prev, variant];
            }
        });
    };

    const clearVariants = () => setSelectedVariants([]);

    return (
        <CartContext.Provider
            value={{ selectedVariants, toggleVariant, clearVariants }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
