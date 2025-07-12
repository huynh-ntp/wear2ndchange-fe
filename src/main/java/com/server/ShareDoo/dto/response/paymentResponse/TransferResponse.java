package com.server.ShareDoo.dto.response.paymentResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {
    private boolean success;
    private String message;
    private String transactionId;
    private String errorCode;
    private String errorMessage;
} 