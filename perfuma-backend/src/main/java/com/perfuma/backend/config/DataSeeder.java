package com.perfuma.backend.config;

import com.perfuma.backend.models.Product;
import com.perfuma.backend.models.User;
import com.perfuma.backend.repositories.ProductRepository;
import com.perfuma.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (productRepository.count() == 0) {
            Product p1 = new Product("Chanel No. 5", "Chanel", "A timeless and legendary floral fragrance.",
                    new BigDecimal("132"), 50,
                    "http://localhost:8080/images/chanel-no5.jpg",
                    "Floral");
            Product p2 = new Product("Black Opium", "Yves Saint Laurent",
                    "A highly addictive feminine fragrance from YSL.", new BigDecimal("112"), 30,
                    "http://localhost:8080/images/black-opium.jpg",
                    "Oriental");
            Product p3 = new Product("La Vie Est Belle", "Lancôme", "An elegant composition of iris and patchouli.",
                    new BigDecimal("98"), 45,
                    "http://localhost:8080/images/la-vie-est-belle.jpg",
                    "Floral");
            Product p4 = new Product("Acqua di Gio", "Giorgio Armani",
                    "Aqautic, aromatic fragrance inspired by the Mediterranean sea.", new BigDecimal("95"), 100,
                    "http://localhost:8080/images/acqua-di-gio.jpg",
                    "Aquatic");
            Product p5 = new Product("Bleu de Chanel", "Chanel",
                    "A woody aromatic fragrance for the man who defies convention.", new BigDecimal("145"), 20,
                    "http://localhost:8080/images/bleu-de-chanel.jpg",
                    "Woody");
            Product p6 = new Product("Flowerbomb", "Viktor & Rolf", "An explosive floral bouquet.",
                    new BigDecimal("165"), 15,
                    "http://localhost:8080/images/flowerbomb.jpg",
                    "Floral Oriental");
            Product p7 = new Product("Sauvage", "Dior", "A radically fresh composition, both raw and noble.",
                    new BigDecimal("110"), 60,
                    "http://localhost:8080/images/sauvage.jpg",
                    "Fougère");
            Product p8 = new Product("Light Blue", "Dolce & Gabbana",
                    "A stunning perfume, overwhelming and irresistible like the joy of living.", new BigDecimal("89"),
                    80, "http://localhost:8080/images/light-blue.jpg",
                    "Citrus");
            Product p9 = new Product("Good Girl", "Carolina Herrera",
                    "A sensual, evocative fragrance born of the beautiful contradictions of modern women.",
                    new BigDecimal("120"), 25,
                    "http://localhost:8080/images/good-girl.jpg",
                    "Oriental Floral");
            Product p10 = new Product("Oud Wood", "Tom Ford", "Rare, exotic, distinctive.", new BigDecimal("210"), 10,
                    "http://localhost:8080/images/oud-wood.jpg",
                    "Woody Oud");

            p1.setSize(42);
            p2.setSize(41);
            p3.setSize(39);
            p4.setSize(43);
            p5.setSize(42);
            p6.setSize(38);
            p7.setSize(43);
            p8.setSize(40);
            p9.setSize(39);
            p10.setSize(42);

            Iterable<Product> seedProducts = List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
            productRepository.saveAll(seedProducts);
            System.out.println("Data seeding complete with 10 initial products.");
        }

        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Perfuma Admin");
            admin.setEmail("admin@perfuma.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setPhone("0000000000");
            admin.setAddress("Admin Office");

            User customer = new User();
            customer.setName("Perfuma Customer");
            customer.setEmail("customer@perfuma.com");
            customer.setPassword("customer123");
            customer.setRole("CUS");
            customer.setPhone("1111111111");
            customer.setAddress("Customer Address");

            userRepository.saveAll(List.of(admin, customer));
            System.out.println("User seeding complete (ADMIN + CUS).");
        }
    }
}
