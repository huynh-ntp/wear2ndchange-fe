package com.server.ShareDoo.dto.request.paymentRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    private String accountNo;
    private BigDecimal amount;
    private String description;
    private String bankCode;
    private String accountName;
} 