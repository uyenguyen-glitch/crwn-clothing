import { useSelector, useDispatch } from "react-redux";
import {
  selectCartIsOpen,
  selectCartCount,
} from "../../store/cart/cart.selector";

import { setIsCartOpen } from "../../store/cart/cart.action";

import { CartIconContainer, ItemCount, ShoppingIcon } from "./cart-icon.styles";

const CartIcon = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector(selectCartIsOpen);
  const cartCount = useSelector(selectCartCount);

  const toggleIsCartOpen = () => dispatch(setIsCartOpen(!isCartOpen));

  return (
    <CartIconContainer onClick={toggleIsCartOpen}>
      <ShoppingIcon className="shopping-icon" />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
};

export default CartIcon;
