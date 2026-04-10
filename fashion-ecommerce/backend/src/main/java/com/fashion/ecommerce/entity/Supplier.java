package com.fashion.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactEmail;

    @Column
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false)
    private Boolean isActive;
}
