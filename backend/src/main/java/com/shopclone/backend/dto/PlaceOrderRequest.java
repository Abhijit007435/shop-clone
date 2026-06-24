
package com.shopclone.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotBlank(message = "Address ID is required")
    private String addressId;
}