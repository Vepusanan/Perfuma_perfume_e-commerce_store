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
                    new BigDecimal("132"), 50, "http://localhost:8080/images/chanel-no5.jpg", "Floral");
            Product p2 = new Product("Black Opium", "Yves Saint Laurent",
                    "A highly addictive feminine fragrance from YSL.", new BigDecimal("112"), 30,
                    "http://localhost:8080/images/black-opium.jpg", "Oriental");
            Product p3 = new Product("La Vie Est Belle", "Lancôme", "An elegant composition of iris and patchouli.",
                    new BigDecimal("98"), 45, "http://localhost:8080/images/la-vie-est-belle.jpg", "Floral");
            Product p4 = new Product("Acqua di Gio", "Giorgio Armani",
                    "Aquatic, aromatic fragrance inspired by the Mediterranean sea.", new BigDecimal("95"), 100,
                    "http://localhost:8080/images/acqua-di-gio.jpg", "Aquatic");
            Product p5 = new Product("Bleu de Chanel", "Chanel",
                    "A woody aromatic fragrance for the man who defies convention.", new BigDecimal("145"), 20,
                    "http://localhost:8080/images/bleu-de-chanel.jpg", "Woody");
            Product p6 = new Product("Flowerbomb", "Viktor & Rolf", "An explosive floral bouquet.",
                    new BigDecimal("165"), 15, "http://localhost:8080/images/flowerbomb.jpg", "Floral Oriental");
            Product p7 = new Product("Sauvage", "Dior", "A radically fresh composition, both raw and noble.",
                    new BigDecimal("110"), 60, "http://localhost:8080/images/sauvage.jpg", "Fougère");
            Product p8 = new Product("Light Blue", "Dolce & Gabbana",
                    "A stunning perfume, overwhelming and irresistible like the joy of living.", new BigDecimal("89"), 80,
                    "http://localhost:8080/images/light-blue.jpg", "Citrus");
            Product p9 = new Product("Good Girl", "Carolina Herrera",
                    "A sensual, evocative fragrance born of the beautiful contradictions of modern women.",
                    new BigDecimal("120"), 25, "http://localhost:8080/images/good-girl.jpg", "Oriental Floral");
            Product p10 = new Product("Oud Wood", "Tom Ford", "Rare, exotic, distinctive.",
                    new BigDecimal("210"), 10, "http://localhost:8080/images/oud-wood.jpg", "Woody Oud");
            Product p11 = new Product("Miss Dior", "Dior", "Fresh rose and peony floral trail with a soft finish.",
                    new BigDecimal("135"), 35, "http://localhost:8080/images/miss-dior.jpg", "Floral");
            Product p12 = new Product("Coco Mademoiselle", "Chanel",
                    "Sparkling citrus opening with sensual patchouli and florals.", new BigDecimal("155"), 28,
                    "http://localhost:8080/images/coco-mademoiselle.jpg", "Oriental Floral");
            Product p13 = new Product("J'adore", "Dior", "Elegant white floral bouquet with luminous fruity nuances.",
                    new BigDecimal("142"), 32, "http://localhost:8080/images/jadore.jpg", "Floral");
            Product p14 = new Product("Euphoria", "Calvin Klein", "Dark fruity oriental scent with creamy amber depth.",
                    new BigDecimal("85"), 40, "http://localhost:8080/images/euphoria.jpg", "Oriental");
            Product p15 = new Product("Chance", "Chanel", "Bright floral fragrance with pink pepper and jasmine notes.",
                    new BigDecimal("148"), 26, "http://localhost:8080/images/chance.jpg", "Floral");
            Product p16 = new Product("212 VIP", "Carolina Herrera",
                    "Playful floral oriental scent with warm sweet undertones.", new BigDecimal("95"), 44,
                    "http://localhost:8080/images/212-vip.jpg", "Floral Oriental");
            Product p17 = new Product("Si", "Giorgio Armani",
                    "Modern floral composition with blackcurrant and vanilla accord.", new BigDecimal("118"), 38,
                    "http://localhost:8080/images/si-armani.jpg", "Floral");
            Product p18 = new Product("Libre", "YSL",
                    "Floral oriental composition with lavender and orange blossom.", new BigDecimal("125"), 36,
                    "http://localhost:8080/images/libre.jpg", "Floral Oriental");
            Product p19 = new Product("Baccarat Rouge 540", "Maison Margiela",
                    "Woody floral signature with radiant amber and saffron.", new BigDecimal("325"), 12,
                    "http://localhost:8080/images/baccarat-rouge.jpg", "Woody Floral");
            Product p20 = new Product("Alien", "Thierry Mugler",
                    "Intense oriental woody perfume with jasmine and amber.", new BigDecimal("99"), 30,
                    "http://localhost:8080/images/alien.jpg", "Oriental Woody");
            Product p21 = new Product("Angel", "Thierry Mugler",
                    "Iconic oriental fragrance with sweet and spicy depth.", new BigDecimal("92"), 34,
                    "http://localhost:8080/images/angel.jpg", "Oriental");
            Product p22 = new Product("Olympéa", "Paco Rabanne",
                    "Salty vanilla oriental floral with smooth sensual warmth.", new BigDecimal("88"), 29,
                    "http://localhost:8080/images/olympea.jpg", "Oriental Floral");
            Product p23 = new Product("1 Million", "Paco Rabanne",
                    "Bold oriental scent with spicy leather and amber notes.", new BigDecimal("97"), 33,
                    "http://localhost:8080/images/1-million.jpg", "Oriental");
            Product p24 = new Product("Invictus", "Paco Rabanne",
                    "Fresh aquatic fragrance with marine and grapefruit accord.", new BigDecimal("94"), 41,
                    "http://localhost:8080/images/invictus.jpg", "Aquatic");
            Product p25 = new Product("Aventus", "Creed",
                    "Fruity chypre blend of pineapple, birch, and musk.", new BigDecimal("435"), 8,
                    "http://localhost:8080/images/aventus.jpg", "Fruity Chypre");

            p1.setSize(42);  p2.setSize(41);  p3.setSize(39);  p4.setSize(43);  p5.setSize(42);
            p6.setSize(38);  p7.setSize(43);  p8.setSize(40);  p9.setSize(39);  p10.setSize(42);
            p11.setSize(39); p12.setSize(40); p13.setSize(39); p14.setSize(41); p15.setSize(40);
            p16.setSize(39); p17.setSize(40); p18.setSize(40); p19.setSize(42); p20.setSize(41);
            p21.setSize(41); p22.setSize(39); p23.setSize(42); p24.setSize(42); p25.setSize(43);

            Iterable<Product> seedProducts = List.of(
                    p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
                    p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
                    p21, p22, p23, p24, p25
            );
            productRepository.saveAll(seedProducts);
            System.out.println("Data seeding complete with 25 products.");
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
