package com.server.ShareDoo.mapper;

import com.server.ShareDoo.dto.response.paymentResponse.OrderResponse;
import com.server.ShareDoo.entity.Order;
import com.server.ShareDoo.entity.User;
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
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponse toOrderResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponse orderResponse = new OrderResponse();

        Integer userId = orderUserUserId( order );
        if ( userId != null ) {
            orderResponse.setUserId( userId.longValue() );
        }
        orderResponse.setUserName( orderUserName( order ) );
        orderResponse.setStatus( statusToString( order.getStatus() ) );
        orderResponse.setId( order.getId() );
        orderResponse.setOrderCode( order.getOrderCode() );
        orderResponse.setTotalAmount( order.getTotalAmount() );
        orderResponse.setDescription( order.getDescription() );
        orderResponse.setPaymentUrl( order.getPaymentUrl() );
        orderResponse.setCreatedAt( order.getCreatedAt() );
        orderResponse.setUpdatedAt( order.getUpdatedAt() );

        return orderResponse;
    }

    @Override
    public List<OrderResponse> toOrderResponseList(List<Order> orders) {
        if ( orders == null ) {
            return null;
        }

        List<OrderResponse> list = new ArrayList<OrderResponse>( orders.size() );
        for ( Order order : orders ) {
            list.add( toOrderResponse( order ) );
        }

        return list;
    }

    private Integer orderUserUserId(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        int userId = user.getUserId();
        return userId;
    }

    private String orderUserName(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String name = user.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
