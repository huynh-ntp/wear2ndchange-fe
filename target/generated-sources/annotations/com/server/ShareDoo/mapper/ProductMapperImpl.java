package com.server.ShareDoo.mapper;

import com.server.ShareDoo.dto.request.productRequest.ProductDTO;
import com.server.ShareDoo.dto.response.productResponse.ResProductDTO;
import com.server.ShareDoo.entity.Product;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T15:19:52+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public Product toEntity(ProductDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.name( dto.getName() );
        product.description( dto.getDescription() );
        product.imageUrl( dto.getImageUrl() );
        product.location( dto.getLocation() );
        product.category( dto.getCategory() );
        product.pricePerDay( dto.getPricePerDay() );
        product.availabilityStatus( dto.getAvailabilityStatus() );

        return product.build();
    }

    @Override
    public ResProductDTO toResDTO(Product entity) {
        if ( entity == null ) {
            return null;
        }

        ResProductDTO resProductDTO = new ResProductDTO();

        resProductDTO.setProductId( entity.getProductId() );
        if ( entity.getUserId() != null ) {
            resProductDTO.setUserId( entity.getUserId().longValue() );
        }
        resProductDTO.setName( entity.getName() );
        resProductDTO.setDescription( entity.getDescription() );
        resProductDTO.setImageUrl( entity.getImageUrl() );
        resProductDTO.setLocation( entity.getLocation() );
        resProductDTO.setCategory( entity.getCategory() );
        resProductDTO.setPricePerDay( entity.getPricePerDay() );
        resProductDTO.setAvailabilityStatus( entity.getAvailabilityStatus() );
        resProductDTO.setCreatedAt( entity.getCreatedAt() );
        resProductDTO.setUpdatedAt( entity.getUpdatedAt() );

        return resProductDTO;
    }
}
