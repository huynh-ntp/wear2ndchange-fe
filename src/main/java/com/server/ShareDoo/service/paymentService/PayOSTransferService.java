package com.server.ShareDoo.service.paymentService;

import com.server.ShareDoo.config.PayOSConfig;
import com.server.ShareDoo.dto.request.paymentRequest.TransferRequest;
import com.server.ShareDoo.dto.response.paymentResponse.TransferResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
@Slf4j
public class PayOSTransferService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PayOSConfig payOSConfig;

    public TransferResponse transferToOwner(String accountNo, String accountName, String bankCode, 
                                          BigDecimal amount, String description) {
        try {
            TransferRequest request = TransferRequest.builder()
                .accountNo(accountNo)
                .accountName(accountName)
                .bankCode(bankCode)
                .amount(amount)
                .description(description)
                .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + getTransferToken());

            HttpEntity<TransferRequest> entity = new HttpEntity<>(request, headers);

            log.info("Sending transfer request: {}", request);

            ResponseEntity<TransferResponse> response = restTemplate.postForEntity(
                payOSConfig.getTransferApiUrl() + "/transfer",
                entity,
                TransferResponse.class
            );

            TransferResponse transferResponse = response.getBody();
            log.info("Transfer response: {}", transferResponse);

            return transferResponse;

        } catch (Exception e) {
            log.error("Error during transfer: ", e);
            return TransferResponse.builder()
                .success(false)
                .errorMessage(e.getMessage())
                .build();
        }
    }

    private String getTransferToken() {
        // Implement token generation for PayOS Transfer API
        // This might involve OAuth2 or API key authentication
        // For now, using the existing API key
        return payOSConfig.getApiKey();
    }

    public boolean validateBankAccount(String accountNo, String bankCode) {
        try {
            // Implement bank account validation
            // This could involve calling PayOS validation API
            return accountNo != null && !accountNo.trim().isEmpty() && 
                   bankCode != null && !bankCode.trim().isEmpty();
        } catch (Exception e) {
            log.error("Error validating bank account: ", e);
            return false;
        }
    }
} 