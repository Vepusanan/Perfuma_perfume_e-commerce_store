package com.perfuma.backend.services;

import com.perfuma.backend.models.CartItem;
import com.perfuma.backend.models.Order;
import com.perfuma.backend.models.OrderItem;
import com.perfuma.backend.models.User;
import com.perfuma.backend.repositories.CartItemRepository;
import com.perfuma.backend.repositories.OrderRepository;
import com.perfuma.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Optional<Order> checkout(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return Optional.empty();
        }

        Order order = new Order();
        order.setUser(userOptional.get());
        order.setOrderDate(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getProduct().getPrice());
            items.add(item);

            total = total.add(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setItems(items);
        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);
        return Optional.of(savedOrder);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
