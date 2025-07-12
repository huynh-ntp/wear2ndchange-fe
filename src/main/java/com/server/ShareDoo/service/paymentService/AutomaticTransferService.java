package com.server.ShareDoo.service.paymentService;

import com.server.ShareDoo.dto.response.paymentResponse.TransferResponse;
import com.server.ShareDoo.entity.Rental;
import com.server.ShareDoo.entity.User;
import com.server.ShareDoo.enums.RentalStatus;
import com.server.ShareDoo.repository.RentalRepository;
import com.server.ShareDoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@Slf4j
public class AutomaticTransferService {

    @Autowired
    private PayOSTransferService payOSTransferService;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private UserRepository userRepository;

    public void scheduleTransferToOwner(Rental rental) {
        try {
            // Tính thời gian kết thúc thuê
            LocalDateTime endTime = rental.getStartDate().plusDays(rental.getRentalDays());
            
            log.info("Scheduling transfer for rental {} at {}", rental.getId(), endTime);

            // Lên lịch chuyển tiền
            taskScheduler.schedule(
                () -> executeTransferToOwner(rental),
                Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant())
            );

            // Cập nhật trạng thái rental
            rental.setTransferStatus(RentalStatus.TRANSFER_PENDING.name());
            rentalRepository.save(rental);

        } catch (Exception e) {
            log.error("Error scheduling transfer for rental {}: ", rental.getId(), e);
        }
    }

    @Async
    public void executeTransferToOwner(Rental rental) {
        try {
            log.info("Executing transfer for rental: {}", rental.getId());

            // Lấy thông tin người cho thuê
            User owner = userRepository.findById(rental.getProduct().getUserId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

            // Kiểm tra thông tin tài khoản ngân hàng
            if (owner.getBankAccountNumber() == null || owner.getBankName() == null) {
                log.error("Owner {} missing bank account information", owner.getUserId());
                handleTransferError(rental, new Exception("Missing bank account information"));
                return;
            }

            // Thực hiện chuyển tiền
            TransferResponse transferResponse = payOSTransferService.transferToOwner(
                owner.getBankAccountNumber(),
                owner.getAccountHolderName() != null ? owner.getAccountHolderName() : owner.getName(),
                getBankCode(owner.getBankName()),
                BigDecimal.valueOf(rental.getTotalPrice()),
                "Thanh toán thuê sản phẩm: " + rental.getProduct().getName()
            );

            if (transferResponse.isSuccess()) {
                // Cập nhật trạng thái đơn
                rental.setStatus(RentalStatus.COMPLETED.name());
                rental.setTransferStatus(RentalStatus.TRANSFER_COMPLETED.name());
                rental.setTransferTransactionId(transferResponse.getTransactionId());
                rental.setTransferDate(LocalDateTime.now());
                rentalRepository.save(rental);

                log.info("Transfer completed successfully for rental: {}", rental.getId());
                
                // TODO: Gửi thông báo cho người cho thuê
                // notificationService.notifyOwner(owner, "Đã chuyển tiền thành công");
                
            } else {
                log.error("Transfer failed for rental {}: {}", rental.getId(), transferResponse.getErrorMessage());
                handleTransferError(rental, new Exception(transferResponse.getErrorMessage()));
            }

        } catch (Exception e) {
            log.error("Error executing transfer for rental {}: ", rental.getId(), e);
            handleTransferError(rental, e);
        }
    }

    private void handleTransferError(Rental rental, Exception e) {
        try {
            // Cập nhật trạng thái lỗi
            rental.setTransferStatus(RentalStatus.TRANSFER_FAILED.name());
            rentalRepository.save(rental);

            // Thử lại sau 1 giờ
            taskScheduler.schedule(
                () -> executeTransferToOwner(rental),
                Date.from(LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant())
            );

            log.info("Scheduled retry for rental {} in 1 hour", rental.getId());

            // TODO: Thông báo cho admin
            // notificationService.notifyAdmin("Lỗi chuyển tiền tự động", e.getMessage());

        } catch (Exception ex) {
            log.error("Error handling transfer error for rental {}: ", rental.getId(), ex);
        }
    }

    private String getBankCode(String bankName) {
        // Map tên ngân hàng sang mã ngân hàng PayOS
        if (bankName == null) return "VCB"; // Default to Vietcombank
        
        switch (bankName.toLowerCase()) {
            case "vietcombank":
            case "vcb":
                return "VCB";
            case "techcombank":
            case "tcb":
                return "TCB";
            case "agribank":
                return "AGB";
            case "bidv":
                return "BIDV";
            case "mbbank":
            case "mb":
                return "MBB";
            case "acb":
                return "ACB";
            case "sacombank":
                return "STB";
            case "vib":
                return "VIB";
            case "vpbank":
                return "VPB";
            default:
                return "VCB"; // Default
        }
    }

    public void executeTransferImmediately(Rental rental) {
        log.info("Executing immediate transfer for rental: {}", rental.getId());
        executeTransferToOwner(rental);
    }
} 