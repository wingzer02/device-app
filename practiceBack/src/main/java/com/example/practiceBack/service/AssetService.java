package com.example.practiceBack.service;

import com.example.practiceBack.dto.Asset;
import com.example.practiceBack.dto.User;
import com.example.practiceBack.mapper.AssetMapper;
import com.example.practiceBack.mapper.AssetUserMapper;
import com.example.practiceBack.mapper.DeviceMapper;
import com.example.practiceBack.mapper.LogMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetMapper assetMapper;
    private final LogMapper logMapper;
    private final DeviceMapper deviceMapper;
    private final AssetUserMapper assetUserMapper;

    public AssetService(
            AssetMapper assetMapper,
            LogMapper logMapper,
            DeviceMapper deviceMapper,
            AssetUserMapper assetUserMapper
    ) {
        this.assetMapper = assetMapper;
        this.logMapper = logMapper;
        this.deviceMapper = deviceMapper;
        this.assetUserMapper = assetUserMapper;
    }

    public List<Asset> getAllAssets() {
        List<Asset> list = assetMapper.findAll();
        for (Asset asset : list) {
            fillUsers(asset);
        }
        return list;
    }

    public Asset getAsset(String assetSerialNumber) {
        Asset asset = assetMapper.findBySerialNumber(assetSerialNumber);
        if (asset != null) {
            fillUsers(asset);
        }
        return asset;
    }

    public void addAsset(Asset asset) {
        assetMapper.insertAsset(asset);
        saveAssetUsers(asset);
        int catId = deviceMapper.findCatIdBySerialNumber(asset.getDeviceSerialNumber());
        if (catId == 2) {
            logMapper.insertLog(asset.getAssetSerialNumber());
        }
    }

    public void updateAsset(Asset asset) {
        assetMapper.updateAsset(asset);
        saveAssetUsers(asset);
    }

    public void deleteAsset(String assetSerialNumber) {
        assetUserMapper.deleteByAssetSerialNumber(assetSerialNumber);
        assetMapper.deleteAsset(assetSerialNumber);
    }

    private void fillUsers(Asset asset) {
        List<User> users = assetUserMapper.findUsersByAssetSerialNumber(asset.getAssetSerialNumber());

        if (users == null || users.isEmpty()) {
            asset.setUserIds(List.of());
            asset.setUserNames(List.of());
            return;
        }

        asset.setUserIds(users.stream().map(User::getUserid).toList());
        asset.setUserNames(users.stream().map(User::getName).toList());
    }

    private void saveAssetUsers(Asset asset) {
        List<String> userIds = asset.getUserIds();
        if (userIds == null) {
            userIds = List.of();
        }

        // 기존 매핑 삭제
        assetUserMapper.deleteByAssetSerialNumber(asset.getAssetSerialNumber());

        // 새 매핑 등록
        for (String uid : userIds) {
            if (uid == null || uid.isBlank()) continue;
            assetUserMapper.insertAssetUser(asset.getAssetSerialNumber(), uid);
        }
    }
}
