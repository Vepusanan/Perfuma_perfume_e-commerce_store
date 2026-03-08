package com.perfuma.backend.services;

import com.perfuma.backend.dto.AddToCartRequest;
import com.perfuma.backend.dto.UpdateCartRequest;
import com.perfuma.backend.models.CartItem;
import com.perfuma.backend.models.Product;
import com.perfuma.backend.models.User;
import com.perfuma.backend.repositories.CartItemRepository;
import com.perfuma.backend.repositories.ProductRepository;
import com.perfuma.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Optional<CartItem> addToCart(AddToCartRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Product> product = productRepository.findById(request.getProductId());
        if (user.isEmpty() || product.isEmpty()) {
            return Optional.empty();
        }

        int qty = request.getQuantity() == null || request.getQuantity() < 1 ? 1 : request.getQuantity();
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId());

        CartItem cartItem = existing.orElseGet(CartItem::new);
        cartItem.setUser(user.get());
        cartItem.setProduct(product.get());
        cartItem.setQuantity(existing.map(item -> item.getQuantity() + qty).orElse(qty));

        return Optional.of(cartItemRepository.save(cartItem));
    }

    public List<CartItem> getUserCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public Optional<CartItem> updateCart(Long cartId, UpdateCartRequest request) {
        return cartItemRepository.findById(cartId).map(item -> {
            int qty = request.getQuantity() == null || request.getQuantity() < 1 ? 1 : request.getQuantity();
            item.setQuantity(qty);
            return cartItemRepository.save(item);
        });
    }

    public void deleteCartItem(Long cartId) {
        cartItemRepository.deleteById(cartId);
    }

    public void clearUserCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
