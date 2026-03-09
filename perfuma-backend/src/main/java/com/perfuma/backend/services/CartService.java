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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    @SuppressWarnings("null")
    public Optional<CartItem> addToCart(AddToCartRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Product> product = productRepository.findById(request.getProductId());
        if (user.isEmpty() || product.isEmpty()) {
            return Optional.empty();
        }

        int qty = request.getQuantity() == null || request.getQuantity() < 1 ? 1 : request.getQuantity();
        Product productEntity = product.get();
        int currentStock = productEntity.getStockQuantity() == null ? 0 : productEntity.getStockQuantity();
        if (currentStock < qty) {
            throw new IllegalStateException("Not enough stock available.");
        }
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId());

        CartItem cartItem = existing.orElseGet(CartItem::new);
        cartItem.setUser(user.get());
        cartItem.setProduct(productEntity);
        cartItem.setQuantity(existing.map(item -> item.getQuantity() + qty).orElse(qty));

        productEntity.setStockQuantity(currentStock - qty);
        productRepository.save(productEntity);
        return Optional.of(cartItemRepository.save(cartItem));
    }

    public List<CartItem> getUserCart(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    @SuppressWarnings("null")
    public Optional<CartItem> updateCart(Long cartId, UpdateCartRequest request) {
        return cartItemRepository.findById(cartId).map(item -> {
            int qty = request.getQuantity() == null || request.getQuantity() < 1 ? 1 : request.getQuantity();
            int oldQty = item.getQuantity() == null ? 0 : item.getQuantity();
            int diff = qty - oldQty;
            Product product = item.getProduct();
            int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

            if (diff > 0 && currentStock < diff) {
                throw new IllegalStateException("Not enough stock available.");
            }

            product.setStockQuantity(currentStock - diff);
            productRepository.save(product);
            item.setQuantity(qty);
            return cartItemRepository.save(item);
        });
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteCartItem(Long cartId) {
        cartItemRepository.findById(cartId).ifPresent(item -> {
            Product product = item.getProduct();
            int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            int qty = item.getQuantity() == null ? 0 : item.getQuantity();
            product.setStockQuantity(stock + qty);
            productRepository.save(product);
            cartItemRepository.deleteById(cartId);
        });
    }

    @Transactional
    @SuppressWarnings("null")
    public void clearUserCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        for (CartItem item : items) {
            Product product = item.getProduct();
            int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            int qty = item.getQuantity() == null ? 0 : item.getQuantity();
            product.setStockQuantity(stock + qty);
            productRepository.save(product);
        }
        cartItemRepository.deleteByUserId(userId);
    }
}
