package com.server.ShareDoo.mapper;

import com.server.ShareDoo.dto.response.paymentResponse.OrderResponse;
import com.server.ShareDoo.entity.OrderItem;
import com.server.ShareDoo.entity.Product;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-11T15:19:52+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Override
    public OrderResponse.OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderResponse.OrderItemResponse orderItemResponse = new OrderResponse.OrderItemResponse();

        orderItemResponse.setProductId( orderItemProductProductId( orderItem ) );
        orderItemResponse.setProductName( orderItemProductName( orderItem ) );
        orderItemResponse.setId( orderItem.getId() );
        orderItemResponse.setQuantity( orderItem.getQuantity() );
        orderItemResponse.setUnitPrice( orderItem.getUnitPrice() );
        orderItemResponse.setTotalPrice( orderItem.getTotalPrice() );
        orderItemResponse.setNotes( orderItem.getNotes() );

        return orderItemResponse;
    }

    @Override
    public List<OrderResponse.OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems) {
        if ( orderItems == null ) {
            return null;
        }

        List<OrderResponse.OrderItemResponse> list = new ArrayList<OrderResponse.OrderItemResponse>( orderItems.size() );
        for ( OrderItem orderItem : orderItems ) {
            list.add( toOrderItemResponse( orderItem ) );
        }

        return list;
    }

    private Long orderItemProductProductId(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        Product product = orderItem.getProduct();
        if ( product == null ) {
            return null;
        }
        Long productId = product.getProductId();
        if ( productId == null ) {
            return null;
        }
        return productId;
    }

    private String orderItemProductName(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        Product product = orderItem.getProduct();
        if ( product == null ) {
            return null;
        }
        String name = product.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
