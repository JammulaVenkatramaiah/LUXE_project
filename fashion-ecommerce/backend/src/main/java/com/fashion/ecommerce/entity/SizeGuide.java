package com.fashion.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "size_guides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SizeGuide {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(length = 10, nullable = false)
    private String size;
    
    @Column(name = "chest_cm")
    private Integer chestCm;
    
    @Column(name = "waist_cm")
    private Integer waistCm;
    
    @Column(name = "hip_cm")
    private Integer hipCm;
    
    @Column(name = "length_cm")
    private Integer lengthCm;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
