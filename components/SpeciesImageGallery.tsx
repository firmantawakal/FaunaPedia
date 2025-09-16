import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SpeciesImageGalleryProps {
    images: string[];
    speciesName: string;
}

export default function SpeciesImageGallery({
    images,
    speciesName
}: SpeciesImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const handleImageError = (index: number) => {
        setImageErrors(prev => new Set([...prev, index]));
    };

    const validImages = images.filter((_, index) => !imageErrors.has(index));

    const renderThumbnail = ({ item, index }: { item: string; index: number }) => {
        const hasError = imageErrors.has(index);

        return (
            <Pressable
                style={styles.thumbnailContainer}
                onPress={() => setSelectedIndex(index)}
            >
                {hasError ? (
                    <View style={styles.thumbnailError}>
                        <Ionicons name="image-outline" size={30} color={Colors.text.secondary} />
                        <Text style={styles.errorText}>Image not available</Text>
                    </View>
                ) : (
                    <Image
                        source={item}
                        style={styles.thumbnail}
                        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                        transition={200}
                        onError={() => handleImageError(index)}
                        cachePolicy="memory-disk"
                    />
                )}
            </Pressable>
        );
    };

    const renderFullImage = ({ item, index }: { item: string; index: number }) => {
        const hasError = imageErrors.has(index);

        return (
            <View style={styles.fullImageContainer}>
                {hasError ? (
                    <View style={styles.fullImageError}>
                        <Ionicons name="image-outline" size={80} color={Colors.surface} />
                        <Text style={styles.fullImageErrorText}>Image not available</Text>
                    </View>
                ) : (
                    <Image
                        source={item}
                        style={styles.fullImage}
                        contentFit="contain"
                        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                        onError={() => handleImageError(index)}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.galleryTitle}>Galeri Foto {speciesName}</Text>

            {validImages.length === 0 ? (
                <View style={styles.noImagesContainer}>
                    <Ionicons name="images-outline" size={60} color={Colors.text.secondary} />
                    <Text style={styles.noImagesText}>Tidak ada foto tersedia</Text>
                </View>
            ) : (
                <FlatList
                    data={validImages}
                    renderItem={renderThumbnail}
                    keyExtractor={(item, index) => `thumb_${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailsContainer}
                />
            )}

            {/* Full Image Modal */}
            <Modal
                visible={selectedIndex !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedIndex(null)}
                statusBarTranslucent
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setSelectedIndex(null)}
                        >
                            <Ionicons name="close" size={30} color={Colors.surface} />
                        </Pressable>
                        <Text style={styles.modalTitle}>
                            {selectedIndex !== null ? `${selectedIndex + 1} dari ${validImages.length}` : ''}
                        </Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <FlatList
                        data={validImages}
                        renderItem={renderFullImage}
                        keyExtractor={(item, index) => `full_${index}`}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={selectedIndex || 0}
                        getItemLayout={(data, index) => ({
                            length: SCREEN_WIDTH,
                            offset: SCREEN_WIDTH * index,
                            index,
                        })}
                        onMomentumScrollEnd={(event) => {
                            const newIndex = Math.round(
                                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                            );
                            setSelectedIndex(newIndex);
                        }}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    galleryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    thumbnailsContainer: {
        paddingHorizontal: 16,
    },
    thumbnailContainer: {
        marginRight: 12,
    },
    thumbnail: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    thumbnailError: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text.secondary,
        borderStyle: 'dashed',
    },
    errorText: {
        fontSize: 10,
        color: Colors.text.secondary,
        marginTop: 5,
        textAlign: 'center',
    },
    noImagesContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: Colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.text.secondary,
        borderStyle: 'dashed',
    },
    noImagesText: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        color: Colors.surface,
        fontWeight: '500',
    },
    headerSpacer: {
        width: 44,
    },
    fullImageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: SCREEN_WIDTH * 0.95,
        height: SCREEN_HEIGHT * 0.7,
    },
    fullImageError: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImageErrorText: {
        fontSize: 16,
        color: Colors.surface,
        marginTop: 10,
    },
});