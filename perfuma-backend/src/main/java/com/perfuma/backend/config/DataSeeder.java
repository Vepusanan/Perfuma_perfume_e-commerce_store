package com.perfuma.backend.config;

import com.perfuma.backend.models.Product;
import com.perfuma.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Product p1 = new Product("Chanel No. 5", "Chanel", "A timeless and legendary floral fragrance.",
                    new BigDecimal("132"), 50,
                    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600",
                    "Floral");
            Product p2 = new Product("Black Opium", "Yves Saint Laurent",
                    "A highly addictive feminine fragrance from YSL.", new BigDecimal("112"), 30,
                    "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?auto=format&fit=crop&q=80&w=600",
                    "Oriental");
            Product p3 = new Product("La Vie Est Belle", "Lancôme", "An elegant composition of iris and patchouli.",
                    new BigDecimal("98"), 45,
                    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
                    "Floral");
            Product p4 = new Product("Acqua di Gio", "Giorgio Armani",
                    "Aqautic, aromatic fragrance inspired by the Mediterranean sea.", new BigDecimal("95"), 100,
                    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=600",
                    "Aquatic");
            Product p5 = new Product("Bleu de Chanel", "Chanel",
                    "A woody aromatic fragrance for the man who defies convention.", new BigDecimal("145"), 20,
                    "https://images.unsplash.com/photo-1523293115678-efa6f112e457?auto=format&fit=crop&q=80&w=600",
                    "Woody");
            Product p6 = new Product("Flowerbomb", "Viktor & Rolf", "An explosive floral bouquet.",
                    new BigDecimal("165"), 15,
                    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600",
                    "Floral Oriental");
            Product p7 = new Product("Sauvage", "Dior", "A radically fresh composition, both raw and noble.",
                    new BigDecimal("110"), 60,
                    "https://images.unsplash.com/photo-1595535373192-fc8935bacd89?auto=format&fit=crop&q=80&w=600",
                    "Fougère");
            Product p8 = new Product("Light Blue", "Dolce & Gabbana",
                    "A stunning perfume, overwhelming and irresistible like the joy of living.", new BigDecimal("89"),
                    80, "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=600",
                    "Citrus");
            Product p9 = new Product("Good Girl", "Carolina Herrera",
                    "A sensual, evocative fragrance born of the beautiful contradictions of modern women.",
                    new BigDecimal("120"), 25,
                    "https://images.unsplash.com/photo-1594913604432-8dfdf44dbbed?auto=format&fit=crop&q=80&w=600",
                    "Oriental Floral");
            Product p10 = new Product("Oud Wood", "Tom Ford", "Rare, exotic, distinctive.", new BigDecimal("210"), 10,
                    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
                    "Woody Oud");

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10));
            System.out.println("Data seeding complete with 10 initial products.");
        }
    }
}
