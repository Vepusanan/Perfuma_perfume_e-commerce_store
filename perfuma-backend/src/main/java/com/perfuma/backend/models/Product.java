package com.perfuma.backend.models;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;

    @Column(length = 2000)
    private String description;

    private BigDecimal price;

    private Integer size;

    @JsonAlias("stock")
    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @JsonAlias("imgURL")
    @Lob
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @JsonAlias("cat")
    private String category;

    public Product() {
    }

    public Product(String name, String brand, String description, BigDecimal price, Integer stockQuantity,
            String imageUrl, String category) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.size = 0;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    @JsonProperty("stock")
    public Integer getStock() {
        return stockQuantity;
    }

    @JsonProperty("stock")
    public void setStock(Integer stock) {
        this.stockQuantity = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @JsonProperty("imgURL")
    public String getImgURL() {
        return imageUrl;
    }

    @JsonProperty("imgURL")
    public void setImgURL(String imgURL) {
        this.imageUrl = imgURL;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @JsonProperty("cat")
    public String getCat() {
        return category;
    }

    @JsonProperty("cat")
    public void setCat(String cat) {
        this.category = cat;
    }
}
