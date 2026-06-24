package com.shopclone.backend.service;

import com.shopclone.backend.dto.AddressRequest;
import com.shopclone.backend.model.Address;
import com.shopclone.backend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    @SuppressWarnings("null")
    public Address addAddress(AddressRequest request) {

        Address address = Address.builder()
                .userId(getCurrentUserId())
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry())
                .createdAt(LocalDateTime.now())
                .build();

        return addressRepository.save(address);
    }

    public List<Address> getMyAddresses() {

        return addressRepository
                .findByUserId(getCurrentUserId());
    }

    public void deleteAddress(@NonNull String addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Address not found"));

        if (!address.getUserId()
                .equals(getCurrentUserId())) {

            throw new IllegalArgumentException("Access denied");
        }

        addressRepository.delete(address);
    }
}