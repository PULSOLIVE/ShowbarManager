package com.showbarmanager.api.shared;

import com.showbarmanager.api.exceptions.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;

public abstract class BaseService<T, R extends BaseRepository<T, UUID>> {

    protected final R repository;

    protected BaseService(R repository) {
        this.repository = repository;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public Page<T> findAll(@NonNull Pageable pageable) {
        return repository.findAll(pageable);
    }

    public T findByIdOrThrow(@NonNull UUID id, String resourceName) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(resourceName + " não encontrado."));
    }

    public T save(@NonNull T entity) {
        return repository.save(entity);
    }

    public void delete(@NonNull UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Registro não encontrado.");
        }

        repository.deleteById(id);
    }

    public boolean exists(@NonNull UUID id) {
        return repository.existsById(id);
    }

    public long count() {
        return repository.count();
    }
}