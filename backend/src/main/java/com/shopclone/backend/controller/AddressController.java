package com.shopclone.backend.controller;

import com.shopclone.backend.dto.AddressRequest;
import com.shopclone.backend.model.Address;
import com.shopclone.backend.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public Address addAddress(
            @Valid @RequestBody AddressRequest request
    ) {
        return addressService.addAddress(request);
    }

    @GetMapping
    public List<Address> getMyAddresses() {
        return addressService.getMyAddresses();
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(
            @PathVariable @NonNull String addressId
    ) {
        addressService.deleteAddress(addressId);
    }
}